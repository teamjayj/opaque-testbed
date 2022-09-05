export type OpaqueClientRegister = {
    user_id: string;
    register_init: string;
    register_finish: string;
};

export type OpaqueClientLogin = {
    user_id: string;
    session_id: string;
    auth_init: string;
    auth_finish: string;
    session_key: string;
};
