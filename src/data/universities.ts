import { evaluationCriterias } from 'data'

const universitiesBaseData = [
  {
    name: {
      ka: 'ივანე ჯავახიშვილის სახელობის თბილისის სახელმწიფო უნივერსიტეტი',
      en: 'Ivane Javakhishvili Tbilisi State University',
    },
    alias: 'tsu',
  },

  {
    name: {
      ka: 'საქართველოს ტექნიკური უნივერსიტეტი',
      en: 'Georgian Technical University',
    },
    alias: 'stu',
  },
]

const ratingCriteriasObject = evaluationCriterias.reduce(
  (acc, criteria) => ({
    ...acc,
    [criteria]: null,
  }),
  {}
)

export const universities = universitiesBaseData.map((university) => ({
  ...university,
  logoSrc: `public/images/universities/${university.alias}.png`,
  ratings: {
    criterias: ratingCriteriasObject,
    users: [],
  },
  averageRating: 0,
  voteCount: 0,
}))
