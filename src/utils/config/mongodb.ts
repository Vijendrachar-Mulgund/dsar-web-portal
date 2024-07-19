export const databaseConnectionUrl = (): string => {
  const connectionString: string = process.env.DATABASE_CONNECTION_URL;
  const connectionPassword: string = process.env.DATABASE_PASSWORD;
  const databaseName: string = process.env.DATABASE_NAME;
  const username: string = process.env.DATABASE_USERNAME;

  let connectionStringWithCredentials = connectionString.replace(
    '<database_name>',
    databaseName,
  );

  connectionStringWithCredentials = connectionStringWithCredentials.replace(
    '<password>',
    connectionPassword,
  );

  connectionStringWithCredentials = connectionStringWithCredentials.replace(
    '<username>',
    username,
  );

  return connectionStringWithCredentials;
};
