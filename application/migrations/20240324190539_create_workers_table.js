/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    return knex.schema.createTable('workers', function (table) {
        table.uuid('id').primary();
        table.uuid('job_id').notNullable();
        table.foreign('job_id').references('id').inTable('jobs').onDelete('CASCADE').onUpdate('CASCADE');
        table.enum('status', ['PENDING', 'WAITING_FOR_PACKETS', 'RUNNING', 'COMPLETED', 'FAILED']).defaultTo('PENDING').notNullable();
        table.uuid('queue_name', 100).notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    exports.down = function (knex) {
        return knex.schema.dropTable('workers');
    };
};
