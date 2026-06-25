---
title: Running Fiber to My New Lab
date: 2026-03-07
summary: My first time pulling fiber without proper attic access. It was messy, stressful, and absolutely worth it.
tags: [lab, fiber, internet]
published: true
---

A while ago I moved into a new room, after using my bedroom as an office for almost two years.

Immediate problem: no Ethernet.

Our house is about 15 years old, and the internal cable paths are not exactly friendly. The service entry is at the back, but both rooms I need connected are at the front. So my "temporary" fix was a UGREEN slim Cat6 cable running across the hallway.

That temporary fix lasted six months.

Then Chinese New Year happened, I got some red packet money, and I also picked up a MikroTik RB5009. At that point, it felt like a sign to stop patching and do it properly.

## Why I chose fiber

I went with:

- 2-core single-mode fiber
- 2x SFP+ 10G single-mode 10 km optics

Main reasons:

- Future-proofing
- Smaller and easier to route than thick Cat6a
- I had used my fiber toolkit before and wanted another opportunity to use it

I had terminated fiber with field connectors before, so I figured this would be manageable.

## The hardest part: pulling cable with no attic access

I don't have normal attic access unless I want to lift roof tiles, so I worked through ceiling light openings. It was rough. I used everything I could get my hands on: a copper wire I bought in the wrong size months ago, and even a measuring tape to hook and guide the cable.

Luckily, the ISP's cable already passed through one of those holes. I cut off the SC connector, tied a rope to the cable, and pulled it through to create a pull cord from my rack to the new office.

Then I tied the new fiber to that cord and pulled it back.

It was not smooth. The new bundle was thicker, got caught repeatedly, and forced me to open another light point to free it. Eventually, after a lot of tugging and patience, I got it through.

## Terminating the fiber

Next step was terminating four SC ends.

I skipped LC fast connectors because they were much more expensive. SC/UPC fast connectors were cheaper and good enough for this run.

The process was straightforward in theory:

- Open the protectors
- Separate the two cores into individual fibers
- Strip, cleave, insert, and lock into the connector

In practice, the first connector took a few tries while I re-learned the workflow. After that, it got much faster. The remaining three connectors took around half an hour total (one for main internet, two for the new run).

## First link, first panic

About an hour after I finished terminating everything, the single-mode optics arrived.

I plugged them in. No lights. Swapped ends. Link came up.

I ran a speed test... and the result was terrible (`90-100 Mbps` down, `~50 Mbps` up).

My first thought was: I broke something.

So I cleaned every SC connector and inline coupler, re-seated everything, checked the light levels (looked fine), and tested again. Somehow that fixed it, and I was suddenly getting full internet speed. I still can't explain exactly which connector was the culprit, but cleaning solved it (I'm glad it's not the LC conenctor since I did not buy a cleaner for that.).

## Final result

The link is reading around `-2 dBm`, which is within spec.

I intentionally designed this short run (~15 m) with a few inline couplers to introduce a bit of loss. With 10 km optics on such a short distance, too much power can be a real issue, and I did not want to risk frying expensive 10G single-mode modules.

So yeah, this project was messy, dusty, and way more annoying than expected. But now the new room has proper fiber backhaul, and the hallway cable is finally gone.

## Cost breakdown (THB)

Here is the total damage:

| Item                                                 | Qty | Unit Price (THB) | Line Total (THB) |
| ---------------------------------------------------- | --: | ---------------: | ---------------: |
| Link UFH9322 outdoor 2-core single-mode fiber (20 m) |   1 |              116 |              116 |
| SC/UPC fast connectors (10 pack)                     |   1 |              240 |              240 |
| SC-LC UPC duplex patch cable (3 m)                   |   1 |              128 |              128 |
| SC-LC UPC duplex patch cable (1 m)                   |   1 |               98 |               98 |
| LC-LC UPC duplex patch cable (1 m)                   |   1 |               93 |               93 |
| 2-core fiber separator                               |   2 |               30 |               60 |
| SC duplex coupler                                    |   2 |               25 |               50 |
| LC coupler                                           |   1 |               23 |               23 |
| SM-LR-10G SFP+ optics                                |   2 |              440 |              880 |
| XikeStor L2 Managed Switch (4x2.5G, 2x10G SFP+)      |   1 |            1,316 |            1,316 |
| Generic Switch (4x2.5G, 2x10G SFP+)                  |   1 |              732 |              732 |
| **Total**                                            |     |                  |        **3,736** |

Would I do it again? Absolutely. It was fun, and I learned a lot.
