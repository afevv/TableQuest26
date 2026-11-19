import Sidebar from "../components/Sidebar"

function Exercise() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <section className="min-h-screen min-w-0 flex-1 bg-[#dce2ef] p-6">
        <h1 className="text-3xl font-bold text-black">
          Welcome back, <span className="text-blue-700">Name</span>
        </h1>
      </section>
    </div>
  )
}

export default Exercise


// Add login page with Clerk.