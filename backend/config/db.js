const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

// Simple promise wrapper to mimic mysql2's promise().execute()
const promiseDb = {
    execute: (sql, params = []) => {
        return new Promise((resolve, reject) => {
            const isSelect = sql.trim().toUpperCase().startsWith('SELECT') || sql.trim().toUpperCase().startsWith('PRAGMA');
            if (isSelect) {
                db.all(sql, params, (err, rows) => {
                    if (err) {
                        console.error('SQL Error (SELECT):', err);
                        reject(err);
                    } else {
                        resolve([rows]);
                    }
                });
            } else {
                db.run(sql, params, function (err) {
                    if (err) {
                        console.error('SQL Error (EXEC):', err);
                        reject(err);
                    } else {
                        resolve([{ insertId: this.lastID, affectedRows: this.changes }]);
                    }
                });
            }
        });
    }
};

module.exports = promiseDb;
