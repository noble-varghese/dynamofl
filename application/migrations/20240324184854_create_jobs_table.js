/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
    return knex.schema.createTable('jobs', function (table) {
        table.uuid('id').primary();
        table.text('name').notNullable();
        table.integer('files_num');
        table.integer('rand_num_count');
        table.integer('worker_count');
        table.uuid('queue_name', 100).notNullable();
        table.enum('status', ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED']).defaultTo('PENDING').notNullable();
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
    exports.down = function (knex) {
        return knex.schema.dropTable('jobs');
    };
};
