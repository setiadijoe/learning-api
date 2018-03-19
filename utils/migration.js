function createAuditTriggerQuery (tableName) {
  /* Usage
   * return queryInterface.createTable( tableName , {
   *   ...
   *   ...
   * })
   * .then( ()=> queryInterface.sequelize.query( util.createAuditTriggerQuery( tableName ) ) ); // Add audit table and audit trigger
   */
  return `CREATE TABLE "${tableName}_A" (
            id          integer,
            before      hstore,
            after       hstore,
            operation   varchar(1),
            change_date timestamptz default now()
          );

          CREATE FUNCTION "A_${tableName}_I"()
            RETURNS TRIGGER
            LANGUAGE PLPGSQL
          as $$
          begin
            INSERT INTO "${tableName}_A"(id, before, after, operation)
            SELECT new.id, hstore(''), hstore(new), 'I';
            RETURN new;
          end
          $$;

          CREATE FUNCTION "A_${tableName}_U"()
            RETURNS TRIGGER
            LANGUAGE PLPGSQL
          as $$
          begin
            INSERT INTO "${tableName}_A"(id, before, after, operation)
            SELECT new.id, hstore(old), hstore(new), 'U';
            RETURN new;
          end
          $$;

          CREATE FUNCTION "A_${tableName}_D"()
            RETURNS TRIGGER
            LANGUAGE PLPGSQL
          as $$
          begin
            INSERT INTO "${tableName}_A"(id, before, after, operation)
            SELECT old.id, hstore(old), hstore(''), 'D';
            RETURN new;
          end
          $$;

          CREATE TRIGGER "TG_${tableName}_I"
            AFTER INSERT ON "${tableName}"
              FOR EACH ROW
          EXECUTE PROCEDURE "A_${tableName}_I"();

          CREATE TRIGGER "TG_${tableName}_U"
            AFTER UPDATE ON "${tableName}"
              FOR EACH ROW
          EXECUTE PROCEDURE "A_${tableName}_U"();

          CREATE TRIGGER "TG_${tableName}_D"
            AFTER DELETE ON "${tableName}"
              FOR EACH ROW
          EXECUTE PROCEDURE "A_${tableName}_D"();`
}

module.exports = {
  createAuditTriggerQuery
}
