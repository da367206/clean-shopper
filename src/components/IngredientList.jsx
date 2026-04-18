import IngredientRow from './IngredientRow'

export default function IngredientList({ ingredients, onAskAI }) {
  return (
    <div className="flex flex-col gap-space-sm">
      <h2 className="text-h3 text-neutral-900">Ingredients</h2>
      <ul
        className="
          flex flex-col
          rounded-radius-lg
          border border-neutral-200
          bg-white
          divide-y divide-neutral-200
          overflow-hidden
        "
      >
        {ingredients.map((ing, i) => (
          <IngredientRow
            key={`${ing.name}-${i}`}
            name={ing.name}
            safetyScore={ing.safetyScore}
            purpose={ing.purpose}
            concerns={ing.concerns}
            source={ing.source}
            onAskAI={onAskAI}
          />
        ))}
      </ul>
    </div>
  )
}
