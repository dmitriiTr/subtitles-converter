export interface Filter {
    name: string,
    type: FilterType
    text: string
}

export enum FilterType {
    DeleteTitle, RemoveText, ReplaceText
}