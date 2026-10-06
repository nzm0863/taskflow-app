#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_NeoPixel.h>
#include <ArduinoJson.h>
#include <ESP32Servo.h>
#include <WiFiClientSecure.h>

const char* ssid = "...";
const char* password = "...";

const char* url =
  "https://taskflow.nnzzm.com/backend/get_projects.php";

#define PIN 5
#define LED_COUNT 64

Adafruit_NeoPixel strip(LED_COUNT, PIN, NEO_GRB + NEO_KHZ800);
Servo myservo;
int ledIndex = 0;
int prevCount = 0;
unsigned long blinkStart = 0;
bool isBlinking = false;

void Color(JsonDocument& doc) {

  strip.clear();
  int ledIndex = 0;

  JsonArray arr = doc.as<JsonArray>();

  for (int i = arr.size() - 1; i >= 0; i--) {

    JsonObject item = arr[i];

    String status = item["status"].as<String>();
    int progress = item["progress_rate"] | 0;

    if (progress >= 100) {
      strip.setPixelColor(ledIndex, 255, 255, 255);
    }
    else if (status == "却下") {
      strip.setPixelColor(ledIndex, 255, 0, 0);
    }
    else if (status == "最終承認済み") {
      strip.setPixelColor(ledIndex, 0, 255, 0);
    }
    else if (status == "最終承認待ち") {
      strip.setPixelColor(ledIndex, 0, 0, 255);
    }
    else if (status == "一次承認待ち") {
      strip.setPixelColor(ledIndex, 255, 255, 0);
    }

    ledIndex++;

    if (ledIndex >= 64) break;
  }

  strip.show();
}

void servoShake() {

  for (int i = 0; i < 2; i++) {

    myservo.write(60);
    delay(200);

    myservo.write(120);
    delay(200);
  }

  myservo.write(90);
}

void setup() {
  Serial.begin(115200);

  strip.begin();
  strip.show();
  strip.setBrightness(3);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("WiFi接続中...");
  }

  Serial.println("WiFi接続完了");

  myservo.attach(18);
}

int pendingCount = 0;
int prevFinalWaitCount = 0;

void loop() {

  if (WiFi.status() == WL_CONNECTED) {

    HTTPClient http;
    WiFiClientSecure client;

    client.setInsecure();

    http.begin(client, url);
    http.setTimeout(10000);

    unsigned long start = millis();
    int code = http.GET();
    int finalWaitCount = 0;

    Serial.print("GET time=");
    Serial.println(millis() - start);

    if (code > 0) {

      pendingCount = 0;
      bool hasReject = false;

      String payload = http.getString();

      DynamicJsonDocument doc(8192);
      deserializeJson(doc, payload);

      for (JsonObject item : doc.as<JsonArray>()) {

        String status = item["status"].as<String>();

        if (status == "却下") hasReject = true;

        if (status == "一次承認待ち" || status == "最終承認待ち") {
          pendingCount++;
        }

        if (status == "最終承認待ち") {
          finalWaitCount++;
        }
      }
      if (finalWaitCount > prevFinalWaitCount) {
        servoShake();
      }

      prevFinalWaitCount = finalWaitCount;

      int currentCount = doc.size();

      if (currentCount > prevCount) {
        isBlinking = true;
        blinkStart = millis();
      }

      prevCount = currentCount;

      Color(doc);

      Serial.print("pendingCount=");
      Serial.println(pendingCount);

    } else {
      Serial.print("HTTP error:");
      Serial.println(code);
    }

    http.end();
  }

  delay(1000);
}