"use client";

import RecommendationForm from "./components/RecommendationForm";
import {useState} from "react";
import Modal from "@/app/components/Modal";

export default function Home() {
    const [stepsModalOpen, setStepsModalOpen] = useState(false);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="text-black">
                <div className="flex gap-3 mb-4 justify-center items-center">
                    <h3>How to Get Your Team ID and Cookie:</h3>
                    <button className="btn bg-black text-white rounded-full rounded px-5 py-2" onClick={() => setStepsModalOpen(true)}>Show Steps</button>
                </div>

                <div>
                    <RecommendationForm />
                </div>

                {stepsModalOpen && (
                    <Modal
                        title="Steps"
                        onClose={() => setStepsModalOpen(false)}
                        isOpen={stepsModalOpen}
                    >
                        <div className="text-black relative">
                            <p className="mb-3">
                                Log in to <a href="https://fantasy.premierleague.com/" className="text-blue-500">Fantasy Premier League</a>.
                            </p>
                            <p className="mb-3">
                                Click on the Points tab<sup>1</sup>, and copy the team ID from the URL<sup>2</sup>
                            </p>
                            <p className="mb-3">
                                Open Inspect Element (DevTools) and navigate to the Network tab<sup>3</sup>. Open the request for <code>&quot;me/&quot;</code><sup>4</sup>.
                            </p>
                            <p className="mb-3">
                                Find the header named <code>cookie</code><sup>5</sup>. Right-click and copy the value.
                            </p>
                            <img src="/steps.png" alt="Cookie Example" className="mt-2 border rounded-lg shadow-sm" />
                        </div>
                    </Modal>
                )}
            </div>
        </div>
    );
}
