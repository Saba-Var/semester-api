import { type IUniversityModel } from 'models'

export const updateCriterias = async (
  targetUniversity: IUniversityModel,
  criteriaName: string,
  criteriaScore: number
) => {
  const criteriaData = targetUniversity.evaluation.criterias[criteriaName]
  const newTotalScore = criteriaData.totalScore + criteriaScore
  const newAverageScore =
    targetUniversity.evaluation.voteCount === 0
      ? criteriaScore
      : newTotalScore / (targetUniversity.evaluation.voteCount + 1)

  criteriaData.totalScore = newTotalScore
  criteriaData.averageScore = newAverageScore

  const criteriaPath = `evaluation.criterias.${criteriaName}`
  await targetUniversity.updateOne({
    $set: {
      [`${criteriaPath}.totalScore`]: newTotalScore,
      [`${criteriaPath}.averageScore`]: newAverageScore,
    },
  })
}
