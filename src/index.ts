import { Sequelize } from 'sequelize-typescript';
import { Argument } from './models/argument.model';
import { Command } from './models/command.model';
import { CommandArgument } from './models/command_argument.model';

const sequelize = new Sequelize({
    database: 'localdb',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    storage: ':memory:',
    models: [
        Argument,
        Command,
        CommandArgument
    ],
    logging: false
});

async function bootstrap() {
    await sequelize.sync({
        force: true
    })
    const argumentsRepo = sequelize.getRepository(Argument);
    const commandsRepo = sequelize.getRepository(Command);

    // Create commands
    const unique = await commandsRepo.create({
        name: "unique"
    })
    const duplicates = await commandsRepo.create({
        name: "duplicates"
    })

    // Create arguments
    const arg1 = await argumentsRepo.create({
        name: "arg1"
    })
    const arg2 = await argumentsRepo.create({
        name: "arg2"
    })
    const arg3 = await argumentsRepo.create({
        name: "arg3"
    })

    // Assign arguments to commands
    await unique.$add("argument", [arg1, arg2, arg3]); // should have 3 arguments
    await duplicates.$add("argument", [arg1, arg1, arg2, arg2]); // should have 4 arguments


    // Reload to parse arguments from database
    await unique.reload({ include: [Argument] });
    await duplicates.reload({ include: [Argument] });

    // Tests
    console.log("Command 'unique' should have 3 arguments", unique.arguments.length)
    console.assert(unique.arguments.length === 3, "Command 'unique' should have 3 arguments") // 3 arguments (CHECK)
    console.log("Command 'duplicates' should have 4 arguments", duplicates.arguments.length)
    console.assert(duplicates.arguments.length === 4, "Command 'duplicates' should have 4 arguments") // 2 arguments (FAILED)
}
bootstrap();