function allSensors(parent, args, context, info) {
  return context.prisma.sensors.findMany();
}

module.exports = {
  allSensors,
};
