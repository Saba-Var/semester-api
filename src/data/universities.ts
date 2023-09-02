import { evaluationCriterias } from 'data'

const ratingCriteriasObject = evaluationCriterias.reduce(
  (acc, criteria) => ({
    ...acc,
    [criteria]: null,
  }),
  {}
)

export const universities = [
  {
    name: {
      ka: 'ივანე ჯავახიშვილის სახელობის თბილისის სახელმწიფო უნივერსიტეტი',
      en: 'Ivane Javakhishvili Tbilisi State University',
    },
    logoSrc: 'public/images/universities/tsu.png',
    ratings: {
      criterias: ratingCriteriasObject,
      users: [],
    },
    averageRating: 0,
    voteCount: 0,
    alias: 'tsu',
  },

  {
    name: {
      ka: 'საქართველოს ტექნიკური უნივერსიტეტი',
      en: 'Georgian Technical University',
    },
    logoSrc: 'public/images/universities/stu.png',
    ratings: {
      criterias: ratingCriteriasObject,
      users: [],
    },
    averageRating: 0,
    voteCount: 0,
    alias: 'stu',
  },
] as const
