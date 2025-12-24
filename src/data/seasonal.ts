export interface SeasonalEvent {
    id: string
    schedule: {
        startMonth: number
        startDay: number
        endMonth: number
        endDay: number
    }
    waifu: {
        enabled: boolean
        url: string
        position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
        styles?: React.CSSProperties
    }
    snow: {
        enabled: boolean
        intensity: number
    }
}

export const seasonalEvents: SeasonalEvent[] = [
    // 1. Specific Event: The Quints (Christmas Special)
    // Higher priority because it appears first
    {
        id: 'the-quints-birthday',
        schedule: {
            startMonth: 5,
            startDay: 6,
            endMonth: 5,
            endDay: 6,
        },
        waifu: {
            enabled: true,
            url: '/waifu/the-quints.png', // User's custom URL
            position: 'bottom-left',
            styles: {
                marginBottom: '0px',
                marginRight: '0px',
                transform: 'scale(1) translate(0px, 0px)',
            },
        },
        snow: {
            enabled: false,
            intensity: 0, // More intense snow for the special day
        },
    },

    // 2. Broad Event: Winter Season
    // Lower priority, covers a wider range
    {
        id: 'winter-season',
        schedule: {
            startMonth: 12,
            startDay: 24,
            endMonth: 1,
            endDay: 15,
        },
        waifu: {
            enabled: false, // No waifu generally
            url: '',
            position: 'bottom-right',
        },
        snow: {
            enabled: true,
            intensity: 50, // Light background snow
        },
    },
]

// Helper type for the active config used in components
export type SeasonalConfig = SeasonalEvent
