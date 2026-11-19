import Sidebar from "../components/Sidebar"

function Social() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <section className="min-h-screen min-w-0 flex-1 bg-[#ffd1a6] p-6">
        <h1 className="text-3xl font-bold">Social</h1>
      </section>
    </div>
  )
}

export default Social
