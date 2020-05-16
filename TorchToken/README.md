# TorchToken

This is a tweak to the popular Torch script. It allows you to light, snuff, or drop torches. It remembers what your previous vision settings are and restores them when you drop/snuff a torch. Dropping a torch will create a torch token underneath you.

Usage:

```
!ttorch light

!!ttorch drop

!!ttorch snuff
```

`!ttorch light` takes the same parameters as the Torch script.

> Note: I'm abandoning this script in favor of just using torch tokens with the Carry Token script. The reason is, if you have a character with darkvision 60 ft., and then light a torch with range 40 ft., your vision is actually _reduced_. You can't just make it 60 ft. because only you and not your allies should be able to see that far. Kind of annoying. Since Roll20 doesn't really distinguish between "light only you can see" and "vision", its best to have the torch's light settings on a separate token you can carry. So... I don't recommend using this script. It was mostly as a fun exercise as my first Roll20 API script.
