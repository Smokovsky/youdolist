export class User {
    id: string;
    accessLevel: number;
    points: number;

    constructor(id: string, accessLevel: number) {
        this.id = id;
        this.accessLevel = accessLevel;
        this.points = 0;
    }

    addPoints(points: number) {
        this.points += points;
    }

    subPoints(points: number) {
        this.points -= points;
    }
}
