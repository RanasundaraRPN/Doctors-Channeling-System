const db = require('./config/db');

async function checkDatabase() {
    try {
        const [tables] = await db.execute("SELECT name FROM sqlite_master WHERE type='table'");

        for (const table of tables) {
            console.log(`\nTable Info for ${table.name}:`);
            const [info] = await db.execute(`PRAGMA table_info(${table.name})`);
            console.table(info);

            console.log(`\nIndex Info for ${table.name}:`);
            const [indexes] = await db.execute(`PRAGMA index_list(${table.name})`);
            console.table(indexes);
        }

    } catch (err) {
        console.error('Error checking database:', err);
    }
}

checkDatabase();
