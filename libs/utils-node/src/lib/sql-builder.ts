/**
 * Represents the type of SQL JOIN operation
 */
type JoinType = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';

/**
 * Configuration for a SQL JOIN clause
 */
interface JoinClause {
  /** The type of JOIN operation */
  type: JoinType;
  /** The table name to join */
  table: string;
  /** The JOIN condition (ON clause) */
  condition: string;
}

/**
 * A fluent SQL query builder for constructing SELECT statements with joins, where clauses, and ordering.
 *
 * @example
 *
 * const query = new SQLQueryBuilder()
 *   .select('u.name', 'p.title')
 *   .from('users u')
 *   .leftJoin('posts p', 'u.id = p.user_id')
 *   .where('u.active = 1')
 *   .orderBy('u.name')
 *   .limit(100)
 *   .build();
 * // Result: "SELECT u.name, p.title FROM users u LEFT JOIN posts p ON u.id = p.user_id WHERE u.active = 1 ORDER BY
 * u.name ASC LIMIT 100"
 *
 */
export class SQLQueryBuilder {
  private selectFields: string[] = ['*'];
  private tableName = '';
  private joins: JoinClause[] = [];
  private whereConditions: string[] = [];
  private orderClause = '';
  private limitClause = '';

  /**
   * Specifies the columns to select in the query
   *
   * @param fields - The column names to select. If no fields are provided, defaults to '*'
   * @returns The SQLQueryBuilder instance for method chaining
   *
   * @example
   *
   * builder.select('name', 'email', 'created_at')
   *
   */
  select(...fields: string[]): this {
    if (fields.length > 0) {
      this.selectFields = fields;
    }
    return this;
  }

  /**
   * Specifies the main table for the FROM clause
   *
   * @param table - The table name (can include alias)
   * @returns The SQLQueryBuilder instance for method chaining
   *
   * @example
   *
   * builder.from('users u')
   *
   */
  from(table: string): this {
    this.tableName = table;
    return this;
  }

  /**
   * Adds a JOIN clause to the query
   *
   * @param type - The type of JOIN operation
   * @param table - The table name to join (can include alias)
   * @param condition - The JOIN condition for the ON clause
   * @returns The SQLQueryBuilder instance for method chaining
   *
   * @example
   *
   * builder.join('LEFT', 'posts p', 'u.id = p.user_id')
   *
   */
  join(type: JoinType, table: string, condition: string): this {
    this.joins.push({ type, table, condition });
    return this;
  }

  /**
   * Adds an INNER JOIN clause to the query
   *
   * @param table - The table name to join (can include alias)
   * @param condition - The JOIN condition for the ON clause
   * @returns The SQLQueryBuilder instance for method chaining
   *
   * @example
   *
   * builder.innerJoin('posts p', 'u.id = p.user_id')
   *
   */
  innerJoin(table: string, condition: string): this {
    return this.join('INNER', table, condition);
  }

  /**
   * Adds a LEFT JOIN clause to the query
   *
   * @param table - The table name to join (can include alias)
   * @param condition - The JOIN condition for the ON clause
   * @returns The SQLQueryBuilder instance for method chaining
   *
   * @example
   *
   * builder.leftJoin('posts p', 'u.id = p.user_id')
   *
   */
  leftJoin(table: string, condition: string): this {
    return this.join('LEFT', table, condition);
  }

  /**
   * Adds a WHERE condition to the query. Multiple conditions are combined with AND
   *
   * @param condition - The WHERE condition
   * @returns The SQLQueryBuilder instance for method chaining
   *
   * @example
   *
   * builder.where('u.active = 1').where('u.age > 18')
   * // Results in: WHERE u.active = 1 AND u.age > 18
   *
   */
  where(condition: string): this {
    this.whereConditions.push(`(${condition})`);
    return this;
  }

  /**
   * Adds an ORDER BY clause to the query
   *
   * @param column - The column name to order by
   * @param ascending - Whether to sort in ascending order (default: true)
   * @returns The SQLQueryBuilder instance for method chaining
   *
   * @example
   *
   * builder.orderBy('created_at', false) // ORDER BY created_at DESC
   *
   */
  orderBy(column: string, ascending = true): this {
    this.orderClause = `ORDER BY ${column} ${ascending ? 'ASC' : 'DESC'}`;
    return this;
  }

  /**
   * Adds an LIMIT clause to the query
   *
   * @param limit - limit number
   *
   * @example
   * builder.limit(100) // LIMIT 100
   *
   */
  limit(limit: number): this {
    this.limitClause = `LIMIT ${limit}`;
    return this;
  }

  /**
   * Builds and returns the final SQL query string
   *
   * @returns The constructed SQL SELECT statement
   * @throws {Error} When no table name is specified via the from() method
   *
   * @example
   *
   * const sql = builder.select('*').from('users').build();
   * // Returns: "SELECT * FROM users"
   *
   */
  build(): string {
    if (!this.tableName) {
      throw new Error('Table name is required');
    }

    let query = `SELECT ${this.selectFields.join(', ')} FROM ${this.tableName}`;

    if (this.joins.length > 0) {
      this.joins.forEach((join) => {
        query += ` ${join.type} JOIN ${join.table} ON ${join.condition}`;
      });
    }

    if (this.whereConditions.length > 0) {
      query += ` WHERE ${this.whereConditions.join(' AND ')}`;
    }

    if (this.orderClause) {
      query += ` ${this.orderClause}`;
    }

    if (this.limitClause) {
      query += ` ${this.limitClause}`;
    }

    return query;
  }
}
