const { ApplicationCommandTypes } = require("../Util/Constants");
const CommandInteractionOptionResolver = require("./CommandInteractionOptionResolver");
const Interaction = require("./Interaction");
class ApplicationCommandInteraction extends Interaction {
  constructor(data = {}, guildId, client) {
    super(data, guildId, client);
    this.commandId = data.data?.id ?? null;
    this.commandName = data.data?.name ?? null;
    this.commandType =
      (typeof data.data?.type === "number"
        ? ApplicationCommandTypes[data.data.type]
        : data.data.type) ?? null;
    this.options = new CommandInteractionOptionResolver(
      data.data,
      this.guildId,
      this.channelId,
      this.client
    );
  }
}

module.exports = ApplicationCommandInteraction;
