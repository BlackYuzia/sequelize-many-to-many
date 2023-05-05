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
    // const bothRepo = sequelize.getRepository(CommandArgument);

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
    // should have 3 arguments
    await unique.$add("argument", arg1, { through: { order: 1 } });
    await unique.$add("argument", arg2, { through: { order: 2 } });
    await unique.$add("argument", arg3, { through: { order: 3 } });
    // should have 4 arguments
    await duplicates.$add("argument", arg1, { through: { order: 1 } });
    await duplicates.$add("argument", arg2, { through: { order: 2 } });
    await duplicates.$add("argument", arg2, { through: { order: 3 } });
    await duplicates.$add("argument", arg1, { through: { order: 4 } });

    // await bothRepo.create({
    //     commandId: 1,
    //     argumentId: 1,
    //     order: 44
    // })
    // await bothRepo.create({
    //     commandId: 1,
    //     argumentId: 1,
    //     order: 55
    // })


    // Reload to parse arguments from database
    await unique.reload({ include: [Argument] });
    await duplicates.reload({ include: [Argument] });

    // Tests
    console.log("Command 'unique' should have 3 arguments", unique.arguments.length)
    console.assert(unique.arguments.length === 3, "Command 'unique' should have 3 arguments") // 3 arguments (CHECK)
    console.log("Command 'duplicates' should have 4 arguments", duplicates.arguments.length)
    console.assert(duplicates.arguments.length === 4, "Command 'duplicates' should have 4 arguments") // 2 arguments (FAILED)

    // ? Explaining
    // We have two commands 'unique' & 'duplicates'
    // First command should have all existed arguments
    // Second command should have arg1 & arg2 arguments but as duplicates (2xarg1 & 2xarg2)
    // In tests we could saw what test failed. Because ORM put 2 arguments instead of 4.
    // What we have in database?
    // command | ...arguments -- comment
    // unique arg1 (1) arg2 (2) arg3 (3) (don't forget also order)
    // duplicates arg2 (3) arg1 (4) -- yep, here we get 2 arguments with orders 3 & 4.
    // ? Expecting
    // I expect next database data:
    // unique arg1 arg2 arg3
    // duplicates arg1 arg2 arg2 arg1
    // In CommandArgument table:
    // 'unique' command
    // commandId:1 argumentId:1 order:1
    // commandId:1 argumentId:2 order:2
    // commandId:1 argumentId:3 order:3
    // 'duplicates' command
    // commandId:2 argumentId:1 order:1
    // commandId:2 argumentId:2 order:2
    // commandId:2 argumentId:2 order:3
    // commandId:2 argumentId:1 order:4
}
bootstrap();