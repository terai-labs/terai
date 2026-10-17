---
'@terai/react': patch
'@terai/react-native': patch
---

Keep the user's locale across Terai upgrades. It is now saved under a stable `terai-locale` key instead of `terai-locale-<version>`, so upgrading Terai no longer resets every user to the default locale. On first load, a locale saved by an older version moves to the new key, and the keys older versions left behind (locale and cached dictionaries) are removed. Cached dictionaries stay per version.
