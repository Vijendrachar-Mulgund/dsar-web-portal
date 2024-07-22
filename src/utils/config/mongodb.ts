export const databaseConnectionUrl = (
  connectionString: string,
  databaseName: string,
  username?: string,
  password?: string,
): string => {
  let connectionStringWithCredentials = connectionString.replace(
    '<database_name>',
    databaseName,
  );

  if (password && username) {
    connectionStringWithCredentials = connectionStringWithCredentials.replace(
      '<username>',
      username,
    );

    connectionStringWithCredentials = connectionStringWithCredentials.replace(
      '<password>',
      password,
    );
  }

  return connectionStringWithCredentials;
};
