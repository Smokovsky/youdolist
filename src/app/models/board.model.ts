export interface Board {
    id?: string;
    name: string;
    position?: number;
    ownerId?: string;
    guestsId?: string[];
}
