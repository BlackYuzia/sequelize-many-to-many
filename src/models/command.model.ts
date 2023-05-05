import { AutoIncrement, BelongsToMany, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Argument } from "./argument.model";
import { CommandArgument } from "./command_argument.model";

export interface ICommand {
    name: string;
}

@Table
export class Command extends Model<ICommand, ICommand> {

    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

    @Column
    declare name: string

    @BelongsToMany(() => Argument, {
        through: {
            model: () => CommandArgument,
            unique: false
        },
        // uniqueKey: ""
    })
    declare arguments: (Argument & { CommandArgument: CommandArgument })[]
}