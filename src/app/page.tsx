import RecommendationForm from "./components/RecommendationForm";

export default function Home() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="flex gap-8">
                <div>
                    <RecommendationForm />
                </div>

                <div className="max-w-md p-4 bg-white shadow-lg rounded-lg text-black">
                    <h3 className="font-semibold">How to Get Your Team ID and Cookie:</h3>
                    <p>
                        Log in to <a href="https://fantasy.premierleague.com/" className="text-blue-500">Fantasy Premier League</a>.
                    </p>
                    <p>
                        Click on the Points tab<sup>1</sup>, and copy the team ID from the URL<sup>2</sup>
                    </p>
                    <p>
                        Open Inspect Element (DevTools) and navigate to the Network tab<sup>3</sup>. Open the request for <code>'me/'</code><sup>4</sup>.
                    </p>
                    <p>
                        Find the header named <code>cookie</code><sup>5</sup>. Right-click and copy the value.
                    </p>
                    <img src="/steps.png" alt="Cookie Example" className="mt-2 border rounded-lg shadow-sm" />
                </div>
            </div>
        </div>
    );
}
