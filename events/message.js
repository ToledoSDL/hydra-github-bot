const config = require("../config.json");
const prefix = config.prefix;
const { Collection } = require("discord.js");
const cooldowns = new Collection();

module.exports = (client, message) => {
  if (message.author.bot) return;
  if (!message.guild) return;

  if (
    !message.content.startsWith(prefix) &&
    message.content.startsWith(client.user.id)
  )
    return message.reply(
      `O meu prefixo é ${prefix}, quer saber todos os comandos? digite \`${prefix}help\`!`
    );
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;

  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));

  if (command) {
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 1) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(
          `Espere ${timeLeft.toFixed(1)} segundo(s) para usar o comando \`${
            command.name
          }\`.`
        );
      }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    try {
      command.run(
        client,
        message,
        args,
        message.author,
        args.join(" "),
        prefix
      );
    } catch (error) {
      console.log(error);
    }
  }
};
