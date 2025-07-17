const fetchCity = async (): Promise<string | null> => {
  try {
    const res = await fetch("https://ipwho.is/");
    const data = await res.json();
    if (data.success) {
      return data.city || null;
    }
    return null;
  } catch (error) {
    console.error("City lookup failed:", error);
    return null;
  }
};
export default fetchCity;
