const fs = require('fs');
const path = require('path');
const { Client, Collection, Events,ModalBuilder,PermissionsBitField,TextInputStyle,TextInputBuilder, GatewayIntentBits,AttachmentBuilder,StringSelectMenuBuilder, EmbedBuilder,ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, REST, Routes } = require('discord.js');

const config = require('./config.json');
const Canvas = require('canvas');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers

    ] 
});

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`This Code was made by DevHub`);

});

const welcomeChannelId = 'your welcome channel'; // << Replace with your real channel ID
client.on('guildMemberAdd', async (member) => {
    console.log(`[+] New member joined: ${member.user.tag}`);
  
    // Create a canvas
    const canvas = Canvas.createCanvas(764, 408);
    const ctx = canvas.getContext('2d');
  
    // Load background image
    const background = await Canvas.loadImage(path.join(__dirname, 'assets/welcome.png'));
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  
    // Load avatar
    const avatarURL = member.user.displayAvatarURL({ extension: 'png', size: 256 });
    const avatar = await Canvas.loadImage(avatarURL);
  
    // Draw circular clipped avatar
    ctx.save();
    ctx.beginPath();
    ctx.arc(275, 204, 130, 0, Math.PI * 2, true); // center: 275x204, radius: 130
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 145, 74, 260, 260); // cropped nicely into white circle
    ctx.restore();
  
    // Add username in the black part (middle-right)
    const tag = `${member.user.username}`;
    ctx.font = '32px Sans';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(tag, 440, canvas.height / 2); // x=560, y=center of canvas
  
    // Convert to image
    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'welcome.png' });
  
    // Create welcome message
    const welcomeMessage = `👋 Welcome <@${member.id}> to **${member.guild.name}**!\nWe are now **${member.guild.memberCount}** members.`;
  
    // Send message to the welcome channel
    const channel = member.guild.channels.cache.get(welcomeChannelId);
    if (!channel) {
      console.error(`❌ Channel not found: ${welcomeChannelId}`);
      return;
    }
  
    try {
      await channel.send({ content: welcomeMessage, files: [attachment] });
      console.log("✅ Welcome image sent!");
    } catch (error) {
      console.error("❌ Failed to send welcome message:", error);
    }
  });

  client.login(config.token);