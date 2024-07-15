export class HealthCheckResponseDto {
  statusCode: number;
  message: string;
  data: {
    currentServerTime: Date;
  };
}
