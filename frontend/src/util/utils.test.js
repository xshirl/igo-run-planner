import sortRowsByProperty from '../sortByProperty';

test('Samples are sorted correctly on altConcentration', () => {
    const sn = {0: {'altConcentration': ''}};
    const s1 = {1: {'altConcentration': '0.72'}};
    const s2 = {2: {'altConcentration': '1.5'}};
    const s3 = {3: {'altConcentration' : '3.7'}};
    const s4 = {4: {'altConcentration' : '2.1'}};
    expect(sortRowsByProperty([sn, s1], 'altConcentration', 'ascending')).toStrictEqual([{'0': {'altConcentration': ''}}, {'1': {'altConcentration': '0.72'}}]);
    expect(sortRowsByProperty([s1, s2], 'altConcentration', 'ascending')).toStrictEqual([{'1': {'altConcentration': '0.72'}}, {'2': {'altConcentration': '1.5'}}]);
    expect(sortRowsByProperty([s3, s4], 'altConcentration', 'ascending')).toStrictEqual([{'4': {'altConcentration': '2.1'}}, {'3': {'altConcentration': '3.7'}}]);
});

test('Samples are sorted correctly on sample id', () => {
    const sn = {0: {'sampleId': ''}};
    const s1 = {1: {'sampleId': '08822_DA_1_1_1_1'}};
    const s2 = {2: {'sampleId': '09838_10_1_1_1_1'}};
    const s3 = {3: {'sampleId' : '06302_AK_33_1'}};
    const s4 = {4: {'sampleId' : '09259_H_103_2'}};
    expect(sortRowsByProperty([s1, s2], 'sampleId', 'ascending')).toStrictEqual([{1: {'sampleId': '08822_DA_1_1_1_1'}}, {2: {'sampleId': '09838_10_1_1_1_1'}}]);
    expect(sortRowsByProperty([s1, s3], 'sampleId', 'ascending')).toStrictEqual([{3:{'sampleId' : '06302_AK_33_1'}}, {1: {'sampleId': '08822_DA_1_1_1_1'}}]);
    expect(sortRowsByProperty([s3, s4], 'sampleId', 'ascending')).toStrictEqual([{3: {'sampleId' : '06302_AK_33_1'}}, {4: {'sampleId' : '09259_H_103_2'}}]);
    expect(sortRowsByProperty([s3, s4, s2], 'sampleId', 'ascending')).toStrictEqual([{3: {'sampleId' : '06302_AK_33_1'}}, {4: {'sampleId' : '09259_H_103_2'}}, {2: {'sampleId': '09838_10_1_1_1_1'}} ]);
});

test('Samples are sorted correctly on readsRequested', () => {
    const sn = {0: {'readNum': ''}};
    
});

