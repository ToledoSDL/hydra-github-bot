module.exports = (client) => {
  console.log(`Discord Bot ${client.user.tag} is online!`);
  client.user.setActivity(`meus commits pro ar`, { type: "PLAYING" });
};
