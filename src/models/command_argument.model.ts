import { AutoIncrement, BelongsToMany, Column, ForeignKey, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { Command } from "./command.model";
import { Argument } from "./argument.model";

@Table
export class CommandArgument extends Model {

    @AutoIncrement
    @PrimaryKey
    @Column
    declare id: number;

    @Unique("commandId_order_unique")
    @ForeignKey(() => Command)
    @Column
    declare commandId: number;

    @ForeignKey(() => Argument)
    @Column
    declare argumentId: number;

    @Unique("commandId_order_unique") // probably, this didn't work (index didn't set to commandId). But, in case of command. Command can't have two or more arguments on the same position (order). <command> <arg1> <arg2> <argN> -- (n can't repeat)
    @Column
    declare order: number; // should be unique per commandId
}