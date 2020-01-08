export class User {
    id: string;
    points: number;

    constructor(id: string) {
        this.id = id;
        this.points = 0;
    }

    addPoints(points: number) {
        this.points += points;
    }

    subPoints(points: number) {
        this.points -= points;
    }
}
