
const userMemberQuery =
    `select m."gymId", m.id, m."firstName", m."lastName", m."guardianContacts", m."dateOfBirth"
      From members m, gyms g where email = $email and m."gymId" = g.id and g.active = true`

module.exports = async function(sequelize, user) {

  const results = await sequelize.query(userMemberQuery, {
    // TODO: there should probably be some limit here, right? like don't return 100000 members...
    model: sequelize.models['member'],
    bind: {
      email: user.email
    }
  })
  const members = results[0]
  const membersByGym = []
  const gymIds = []

  for (let member of members) {
    const gymId = member.gymId

    let gym
    if (gymId in membersByGym ) {
      gym = membersByGym[gymId]
    }else {
      gym = { gymId, members: [] }
      gymIds.push(gymId)
    }
    gym.members.push(member)
    membersByGym[gymId] = gym
  }

  // Ok, now we can sort to make a reproducible result
  gymIds.sort()

  const sortedMembersWithGym = []
  for (let gymId of gymIds) {
    sortedMembersWithGym.push(membersByGym[gymId])
  }

  return sortedMembersWithGym
}
