import React, { useTransition } from 'react'
import { TabView, TabPanel } from 'primereact/tabview'
import { Dropdown } from 'primereact/dropdown'
import { RandomWord } from '../components/RandomWord'
import { GuessWordsWithLetters } from '../components/GuessWordsWithLetters'
import { useUnit } from 'effector-react'
import { $pwaPrompt, setPwaPrompt } from '../state/standalone'
import { useTranslation } from 'react-i18next'

export const HomePage = () => {
    const { i18n, t } = useTranslation()
    const pwaPrompt = useUnit($pwaPrompt)

    const languages = [
        { label: t('English'), value: 'en' },
        { label: t('French'), value: 'fr' },
    ]

    return (
        <main>
            <div className="flex flex-column h-full">
                <h1 className="text-primary text-center mb-0 mt-2">
                    NsWords
                    {!!pwaPrompt && (
                        <span
                            className="text-green-500 cursor-pointer hover:text-primary"
                            onClick={() => {
                                pwaPrompt.prompt()
                                pwaPrompt.userChoice.then(() =>
                                    setPwaPrompt(null)
                                )
                            }}
                        >
                            <i className="text-2xl ml-3 pi pi-cloud-download" />{' '}
                            <span className="text-xs vertical-align-middle">
                                Installer
                            </span>
                        </span>
                    )}
                </h1>
                <div className="p-2">
                    <Dropdown
                        value={i18n.language}
                        options={languages}
                        onChange={(e) => i18n.changeLanguage(e.value)}
                        placeholder={t('language')}
                    />
                </div>
                <TabView className="flex-1 flex flex-column overflow-hidden">
                    <TabPanel header={t('wordScramble')}>
                        <GuessWordsWithLetters />
                    </TabPanel>
                    <TabPanel header={t('mysteryWord')}>
                        <RandomWord />
                    </TabPanel>
                </TabView>
            </div>
        </main>
    )
}
