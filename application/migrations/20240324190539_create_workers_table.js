/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    return knex.schema.createTable('workers', function (table) {
        table.uuid('id').primary();
        table.uuid('job_id').notNullable();
        table.foreign('job_id').references('id').inTable('jobs').onDelete('CASCADE').onUpdate('CASCADE');
        table.enum('status', ['PENDING', 'COMPLETED', 'FAILED']).defaultTo('PENDING').notNullable();
        table.string('queue_name', 50).notNullable();
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
