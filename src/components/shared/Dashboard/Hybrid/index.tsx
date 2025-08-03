export default function HybridDashboard() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Hybrid Dashboard</h1>
            <p>Welcome, multi-talented individual! You have both customer and seller functionalities.</p>
            {/* You might embed parts of CustomerDashboard and SellerDashboard here */}
            <div className="mt-8 border-t pt-4">
                <h2 className="text-xl font-semibold mb-2">Your Customer Section</h2>
                {/* <CustomerDashboardContent /> // Re-use components */}
                <p>Customer specific info...</p>
            </div>
            <div className="mt-8 border-t pt-4">
                <h2 className="text-xl font-semibold mb-2">Your Seller Section</h2>
                {/* <SellerDashboardContent /> // Re-use components */}
                <p>Seller specific info...</p>
            </div>
        </div>
    );
}