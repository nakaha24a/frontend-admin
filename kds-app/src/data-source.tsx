// src/db.ts

import * as sqlite3 from 'sqlite3';

// データベースファイルへのパス
const DB_PATH = '../../../backend-server/order_system.db'; 

// データベース接続インスタンス
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    // 接続エラー時の処理
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

/**
 * SQL実行ラッパー関数（Promiseを返す）
 * @param sql 実行するSQL
 * @param params パラメータ（オプション）
 * @returns 実行結果
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function run(sql: string, params: any[] = []): Promise<sqlite3.RunResult> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (this: sqlite3.RunResult, err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}


export default db;