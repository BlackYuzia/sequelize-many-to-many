import { AutoIncrement, BelongsToMany, Column, Model, PrimaryKey, Table } from "sequelize-typescript";
import { Command } from "./command.model";
import { CommandArgument } from "./command_argument.model";

export interface IArgument {
    name: string;
}

@Table
export class Argument extends Model<IArgument, IArgument> {

    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

    @Column
    declare name: string

    @BelongsToMany(() => Command, {
        through: {
            model: () => CommandArgument,
            unique: false
        },
        // uniqueKey: ""
    })
    declare commands: (Command & { CommandArgument: CommandArgument })[]
}