import { useEffect, useState } from "react";

export function useTrajet(tripId) {
  const [trajet, setTrajet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tripId) return;

    const fetchTrajet = async () => {
      try {
        const response = await fetch(`http://localhost:8083/api/trajets/${tripId}`);
        if (!response.ok) throw new Error("Failed to fetch trajet");
        const data = await response.json();
        setTrajet(data);
      } catch (err) {
        console.error("❌ Error fetching trajet:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrajet();
  }, [tripId]);

  return { trajet, loading, error };
}
