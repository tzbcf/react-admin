type CommandData = {
    IS_ENABLE: string;
    OPERATOR: string;
    SCHEME_GUID: string;
    SCHEME_NAME: string;
    rn__: number;
}

type CommandList = {
    total: number;
    rows: CommandData[];
}

type CommandParams = {
    page: number;
    rows: number;
    schemeName?: string;
}

type UpdateCommand = {
    schemeName: string;
    enabled: string;
    schemeGuid?: string;
}

export {
    CommandData,
    CommandList,
    CommandParams,
    UpdateCommand,
}
;
