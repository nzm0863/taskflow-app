# Information

## アプリ情報
- アプリ名: TaskFlow
- URL: https://www.nnzzm.com/project_management/


## デモ動画

TaskFlow IoTの動作デモ動画：
https://www.youtube.com/watch?v=A44YyAnDyGU

## 動作確認用アカウント

| 権限 | メールアドレス | パスワード |
|---|---|---|
| admin | test3@test.com | 000 |
| manager | test2@test.com | 000 |
| user | test1@test.com | 000 |

![テストアカウント一覧](./images/users.png)

## デプロイ環境
- サーバー: さくらのレンタルサーバー
- ドメイン: nnzzm.com
- フロントエンド: React + Vite
- バックエンド: PHP / MySQL
- IoT連携: ESP32
- デスクトップアプリ: Tauri / Rust

## デスクトップアプリ対応

Tauri を使用して Windows デスクトップアプリ化を行いました。

- Rust ベースの Tauri を採用
- Windows インストーラー（.exe）生成対応
- React + TypeScript の既存フロントエンドを再利用
- 本番環境の PHP API と HTTPS 通信

![DesktopApp](./images/desktop_app.png)

## 補足
詳細資料は doc フォルダ内の PDF を参照してください。

## 資料一覧
- manual_nakamura.pdf
- presentation_nakamura.pdf

### deploy
- deploy_nakamura.pdf
- test_account_nakamura.pdf

### ER
- new_er.pdf
- old_er.pdf
