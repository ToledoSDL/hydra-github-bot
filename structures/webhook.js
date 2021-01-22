const { MessageEmbed } = require("discord.js");

module.exports = (client) => {
  var http = require("http");
  var createHandler = require("github-webhook-handler");
  var handler = createHandler({ path: "/webhook", secret: "jamaraca" });

  http
    .createServer(function (req, res) {
      handler(req, res, function (err) {
        res.statusCode = 404;
      });
    })
    .listen(3020);

  handler.on("error", function (err) {
    console.error("Error:", err.message);
  });

  handler.on("push", function (event) {
    const embed = new MessageEmbed()
      .setAuthor(
        event.payload.sender.login,
        event.payload.sender.avatar_url,
        event.payload.sender.html_url
      )
      .setTitle(event.payload.repository.full_name)
      .addField("Mensagem do commit:", event.payload.head_commit.message)
      .setFooter(event.payload.repository.description)
      .setTimestamp()
      .setURL(event.payload.repository.html_url)
      .setColor("#c078f0");
    logger(embed);
  });

  handler.on("issues", function (event) {
    const embed = new MessageEmbed()
      .setAuthor(
        event.payload.sender.login,
        event.payload.sender.avatar_url,
        event.payload.sender.html_url
      )
      .setTitle(event.payload.repository.full_name)
      .setDescription(
        `${event.payload.issue.title}\n\n${event.payload.issue.body}`
      )
      .addField("Número da issue:", event.payload.issue.number)
      .addField(
        "Foi:",
        event.payload.action === "closed" ? "Fechada" : "Aberta"
      )
      .setFooter(event.payload.repository.description)
      .setTimestamp()
      .setURL(event.payload.repository.html_url)
      .setColor("#e8452c");
    logger(embed);
  });

  handler.on("*", function (event) {
    console.log(event);
  });

  function logger(message) {
    const channel = client.channels.cache.get("751119080748220496");
    channel.send(message);
  }
};
