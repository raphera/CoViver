class Token {
    id: number = 0;
    userId: number = 0;
    accessToken: string = "";
    refreshToken: string = "";
    userAgent: string = "";
    ip: string = "";
    createdAt: Date = new Date();
    updatedAt: Date = new Date();
}

export default Token;