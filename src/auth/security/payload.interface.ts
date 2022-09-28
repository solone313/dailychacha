export interface Payload{
    user_id: number;
    email: string;
}

export interface SigninPayload{
    email: string;
    exp: number;
}
