const JobPageCardSkeleton = () => {
  return (
      <div className="bg-white rounded-2xl border border-surface-200 p-5 animate-pulse">
          <div className="flex justify-between mb-3"><div className="h-5 w-28 rounded-full bg-surface-200" /><div className="h-4 w-16 rounded bg-surface-200" /></div>
          <div className="h-5 w-3/4 rounded bg-surface-200 mb-2" />
          <div className="h-4 w-full rounded bg-surface-200 mb-1" />
          <div className="h-4 w-2/3 rounded bg-surface-200 mb-4" />
          <div className="flex gap-2"><div className="h-5 w-5 rounded-full bg-surface-200" /><div className="h-4 w-24 rounded bg-surface-200" /></div>
      </div>
  )
}
export default JobPageCardSkeleton



// const JobPageCardSkeleton = () => {
//   return (
//     <div className="bg-white dark:bg-gunmetal-800 rounded-2xl border border-surface-200 dark:border-gunmetal-500 p-5 animate-pulse">
//       <div className="flex justify-between mb-3">
//         <div className="h-5 w-28 rounded-full bg-surface-200 dark:bg-gunmetal-600" />
//         <div className="h-4 w-16 rounded bg-surface-200 dark:bg-gunmetal-600" />
//       </div>
//       <div className="h-5 w-3/4 rounded bg-surface-200 dark:bg-gunmetal-600 mb-2" />
//       <div className="h-4 w-full rounded bg-surface-200 dark:bg-gunmetal-600 mb-1" />
//       <div className="h-4 w-2/3 rounded bg-surface-200 dark:bg-gunmetal-600 mb-4" />
//       <div className="flex gap-2">
//         <div className="h-5 w-5 rounded-full bg-surface-200 dark:bg-gunmetal-600" />
//         <div className="h-4 w-24 rounded bg-surface-200 dark:bg-gunmetal-600" />
//       </div>
//     </div>
//   )
// }
// export default JobPageCardSkeleton