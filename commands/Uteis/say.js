module.exports = {
  name: "say",
  category: "Uteis",
  aliases: ["falar"],
  cooldown: 2,
  usage: "say <Texto>",
  description: "Faz eu falar",
  run: async (client, message, args, user, text, prefix) => {
    message.channel.send(args.slice(1).join(" "));
  },
};
