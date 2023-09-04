import type { IUniversitiesBaseData } from 'models'
import { evaluationCriterias } from 'data'

const universitiesBaseData: IUniversitiesBaseData[] = [
  {
    name: {
      ka: 'ივანე ჯავახიშვილის სახელობის თბილისის სახელმწიფო უნივერსიტეტი',
      en: 'Ivane Javakhishvili Tbilisi State University',
    },
    alias: 'tsu',
    code: '001',
    website: 'tsu.ge',
  },

  {
    name: {
      ka: 'საქართველოს ტექნიკური უნივერსიტეტი',
      en: 'Georgian Technical University',
    },
    alias: 'gtu',
    code: '003',
    website: 'gtu.ge',
  },

  {
    name: {
      ka: 'შავი ზღვის საერთაშორისო უნივერსიტეტი',
      en: 'International Black Sea University',
    },
    alias: 'ibsu',
    code: '064',
    website: 'ibsu.edu.ge',
  },

  {
    name: {
      ka: 'ალტე უნივერსიტეტი',
      en: 'Alte University',
    },
    alias: 'alte',
    code: '085',
    website: 'alte.edu.ge',
  },

  {
    name: {
      ka: 'საქართველოს უნივერსიტეტი',
      en: 'The University of Georgia',
    },
    alias: 'ug',
    code: '121',
    website: 'ug.edu.ge',
  },

  {
    name: {
      ka: 'ბრიტანული სასწავლო უნივერსიტეტი საქართველოში',
      en: 'British University In Georgia',
    },
    alias: 'bug',
    code: '199',
    website: 'britishuni.edu.ge',
  },

  {
    name: {
      ka: 'საქართველოს საზოგადოებრივ საქმეთა ინსტიტუტი',
      en: 'Georgian Institute Of Public Affairs',
    },
    alias: 'gipa',
    code: '153',
    website: 'gipa.ge',
  },

  {
    name: {
      ka: 'საქართველოს აგრარული უნივერსიტეტი',
      en: 'Agricultural University of Georgia',
    },
    alias: 'agruni',
    code: '005',
    website: 'agruni.edu.ge',
  },

  {
    name: {
      ka: 'ევროპის უნივერსიტეტი',
      en: 'European University',
    },
    alias: 'eu',
    code: '171',
    website: 'eu.edu.ge',
  },

  {
    name: {
      ka: 'კავკასიის უნივერსიტეტი',
      en: 'Caucasus University',
    },
    alias: 'cu',
    code: '122',
    website: 'cu.edu.ge',
  },

  {
    name: {
      ka: 'ილიას სახელმწიფო უნივერსიტეტი',
      en: 'Ilia State University',
    },
    alias: 'iliauni',
    code: '010',
    website: 'iliauni.edu.ge',
  },

  {
    name: {
      ka: 'საქართველოს ეროვნული უნივერსიტეტი სეუ',
      en: 'Georgian National University SEU',
    },
    alias: 'seu',
    code: '152',
    website: 'seu.edu.ge',
  },

  {
    name: {
      ka: 'თბილისის სახელმწიფო სამედიცინო უნივერსიტეტი',
      en: 'Tbilisi State Medical University',
    },
    alias: 'tsmu',
    code: '006',
    website: 'tsmu.edu',
  },

  {
    name: {
      ka: 'სოხუმის სახელმწიფო უნივერსიტეტი',
      en: 'Sokhumi State University',
    },
    alias: 'sou',
    code: '012',
    website: 'sou.edu.ge',
  },

  {
    name: {
      ka: 'ქუთაისის საერთაშორისო უნივერსიტეტი',
      en: 'Kutaisi International University',
    },
    alias: 'kiu',
    code: '197',
    website: 'kiu.edu.ge',
  },

  {
    name: {
      ka: 'ქართულ-ამერიკული უნივერსიტეტი',
      en: 'Georgian American University',
    },
    alias: 'gau',
    code: '120',
    website: 'gau.edu.ge',
  },

  {
    name: {
      ka: 'ქუთაისის უნივერსიტეტი',
      en: 'Kutaisi University',
    },
    alias: 'unik',
    code: '019',
    website: 'unik.edu.ge',
  },

  {
    name: {
      ka: 'ბიზნესისა და ტექნოლოგიების უნივერსიტეტი',
      en: 'Business and Technology University',
    },
    alias: 'btu',
    code: '195',
    website: 'btu.edu.ge',
  },

  {
    name: {
      ka: 'გრიგოლ რობაქიძის სახელობის უნივერსიტეტი',
      en: 'Grigol Robakidze University',
    },
    alias: 'gruni',
    code: '033',
    website: 'gruni.edu.ge',
  },

  {
    name: {
      ka: 'თბილისის თავისუფალი უნივერსიტეტი',
      en: 'Free University of Tbilisi',
    },
    alias: 'freeuni',
    code: '036',
    website: 'freeuni.edu.ge',
  },

  {
    name: {
      ka: 'კავკასიის საერთაშორისო უნივერსიტეტი',
      en: 'Caucasus International University',
    },
    alias: 'ciu',
    code: '115',
    website: 'ciu.edu.ge',
  },

  {
    name: {
      ka: 'სულხან-საბა ორბელიანის სასწავლო უნივერსიტეტი',
      en: 'Sulkhan-Saba Orbeliani University',
    },
    alias: 'sabauni',
    code: '088',
    website: 'sabauni.edu.ge',
  },

  {
    name: {
      ka: 'წმ. ანდრია პირველწოდებულის სახელობის ქართული უნივერსიტეტი',
      en: 'Andria Pirveltsodebuli University',
    },
    alias: 'sangu',
    code: '145',
    website: 'sangu.edu.ge',
  },
]

const ratingCriteriasObject = evaluationCriterias.reduce(
  (acc, criteria) => ({
    ...acc,
    [criteria]: {
      averageScore: null,
      totalScore: 0,
    },
  }),
  {}
)

export const universities = universitiesBaseData.map((university) => ({
  ...university,
  logoSrc: `public/images/universities/${university.alias}.png`,
  evaluation: {
    criterias: ratingCriteriasObject,
    users: [],
    voteCount: 0,
  },
  averageRating: 0,
}))
