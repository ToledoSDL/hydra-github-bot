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
    client.user.setActivity(`commit: ${event.payload.head_commit.id}`, { type: "PLAYING"})
    const embed = new MessageEmbed()
      .setAuthor(
        event.payload.sender.login,
        event.payload.sender.avatar_url,
        event.payload.sender.html_url
      )
      .setTitle(event.payload.repository.full_name)
      .addField("Mensagem do commit:", event.payload.head_commit.message ? event.payload.head_commit.message : 'Nenhuma')
      .setFooter(event.payload.repository.description)
      .setTimestamp()
      .setURL(event.payload.repository.html_url)
      .setColor("#c078f0");
    logger(embed);
  });

  handler.on("check_suite", function (event) {
    const embed = new MessageEmbed()
      .setAuthor(
        event.payload.sender.login,
        event.payload.sender.avatar_url,
        event.payload.sender.html_url
      )
      .setTitle(event.payload.repository.full_name)
      .addField("Ação do check suite", event.payload.check_suite.status)
      .setFooter(event.payload.repository.description)
      .setTimestamp()
      .setURL(event.payload.repository.html_url)
      .setColor("#e69d20");
    logger(embed);
  });

  handler.on("check_run", function (event) {
    const embed = new MessageEmbed()
      .setAuthor(
        event.payload.sender.login,
        event.payload.sender.avatar_url,
        event.payload.sender.html_url
      )
      .setTitle(event.payload.repository.full_name)
      .addField("Ação do check run", event.payload.check_run.status)
      .setFooter(event.payload.repository.description)
      .setTimestamp()
      .setURL(event.payload.repository.html_url)
      .setColor("#e69d20");
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

  handler.on("pull_request", function (event) {
    console.log(event);
    const embed = new MessageEmbed()
      .setAuthor(
        event.payload.sender.login,
        event.payload.sender.avatar_url,
        event.payload.sender.html_url
      )
      .setTitle(event.payload.repository.full_name)
      .setDescription(
        `${event.payload.pull_request.title}\n\n${event.payload.pull_request.html_url}`
      )
      .addField("Número da pull request:", event.payload.pull_request.number)
      .addField(
        "Ação:",
        event.payload.action === "closed" ? "Fechada" : "Aberta"
      )
      .setFooter(event.payload.repository.description)
      .setTimestamp()
      .setURL(event.payload.repository.html_url)
      .setColor("#cc2b73");
    logger(embed);
  });
  function logger(message) {
    const channel = client.channels.cache.get("751119080748220496");
    channel.send(message);
  }
};
